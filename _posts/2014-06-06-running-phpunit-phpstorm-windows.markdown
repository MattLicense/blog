---
layout: post
title:  "Running PHPUnit 4 in PHPStorm 7 in Windows"
---
I've been setting up PHP Storm, my IDE of choice, up for a new project today. Usually, I set up a Vagrant box\*, but I'm looking at a couple of smaller projects which don't really require a virtual machine running in the background.

\* _I highly recommend Vagrant for your development environment. It allows you to mimic your production as closely as possible and works well with provisioners like Chef and Puppet._

So I've gone about setting up PHP, Composer, and PHPUnit on my Windows 8 machine (my primary computer). PHP was straightforward, the zip downloaded from php.net contained the binary files for Windows so I just needed to add the folder to the the ```PATH``` variable. Composer was equally easy, I just needed to enable the OpenSSL extension that is included in the PHP download.

Once I had these setup, I added PHPUnit 4.1 as a dependency in my ```composer.json``` file along with the others I was after, and ran ```composer install```. I figured it would be fairly easy to setup PHPUnit in PHPStorm since it's one of the default run tasks available. I set it up under **Settings->[Project Settings] PHP->PHPUnit** by setting the **Path to phpunit.phar** to the ```phpunit.bat``` that Composer downloaded. When I went to run my initial unit tests I was shown a console with a fatal error:

```bash
Fatal error: Uncaught exception 'UnexpectedValueException' with message 'Cannot create phar 'D:/Projects/pricing-test/vendor/bin/phpunit.bat', file extension (or combination) not recognised or the directory does not exist' in C:\Users\Matt\AppData\Local\Temp\ide-phpunit.php:177
```

So I figured it would have something to do with using the ```phpunit.bat``` file instead of the ```.phar``` was asking, but even with that it returned the same error. I figured I would point try the custom loader option, and point it towards my projects ```autoload.php```.

[![Setting the custom loader for PHPUnit](/blog/images/posts/2014-06-06-phpstorm-phpunit-custom-loader.png "Setting the custom loader for PHPUnit")][img1]

This gave me a new error, it appeared to be an error in PHPStorms implementation of PHPUnit:

```bash
Fatal error: Class IDE_PHPUnit_Framework_TestListener contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (PHPUnit_Framework_TestListener::addRiskyTest) in C:\Users\Matt\AppData\Local\Temp\ide-phpunit.php on line 504
PHP Fatal error:  Class IDE_PHPUnit_Framework_TestListener contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (PHPUnit_Framework_TestListener::addRiskyTest) in C:\Users\Matt\AppData\Local\Temp\ide-phpunit.php on line 504
```

From the error, we can see that PHPStorms ```IDE_PHPUnit_Framework_TestListener``` didn't implement an ```addRiskyTest``` function that is defined in the framework (for version 4+ of PHPUnit). After some time Googling for a solution, I found a StackOverflow question<sup>[[1][php.jar]]</sup> which seemed to work for IntelliJ.

The solution basically revolved around modifying the ```php.jar``` file that the IDE uses for its task runners. _Since I was messing with the internals of a JAR file, I created a backup before I started any modification_. What I needed to do was:

1. Find the JAR file and unzip it. I found the file in ```C:\Program Files (x86)\JetBrains\PhpStorm 7.1.2\plugins\php\lib```
2. Unzip it. This gave me 8 folders, but the one we're interested in is the ```scripts``` folder where we find ```phpunit.php```
3. Then we find the ```IDE_PHPUnit_Framework_TestListener``` implementation which was somewhere around line 310 for me working in PHPStorm 7.1.3, and added the following line of code inside the class:

```ruby
public function addRiskyTest(PHPUnit_Framework_Test $test, Exception $e, $time){}
```

[![Adding the addRiskyTest function to IDE_PHPUnit_Framework_TestListener](/blog/images/posts/2014-06-06-phpunit-testListener-addRiskyTest.png "Adding the addRiskyTest function to IDE_PHPUnit_Framework_TestListener")][img2]

I saved this new version in the JAR file and booted PHPStorm back up. Once this was done, PHPUnit ran completely fine. Looking at the documentation for the ```PHPUnit_Framework_TestListener``` interface, it seems that the ```addRiskyTest``` function is used to alert the user that it deems the test risky - that is, when running in strict mode<sup>[[2][strict]]</sup>, it will alert the user when:

* a test does not include any assertions;
* a test that is annotated with ```@cover``` and executes code not listed using a ```@covers``` or ```@uses``` annotation; or
* a test that omits output (e.g. by using ```print()```).

So while it does take away some of the newer functionality of PHPUnit 4, it allows me to run unit tests in Windows which is what I need.

\[1]: [StackOverflow - IntelliJ IDEA won't run PHPUnit 4.0 tests][php.jar]<br>
\[2]: [PHPUnit Manual - Strict Mode][strict]

[php.jar]: https://stackoverflow.com/questions/22799619/intellij-idea-wont-run-phpunit-4-0-tests/22799620#22799620
[strict]: http://phpunit.de/manual/current/en/strict-mode.html
[img1]: /blog/images/posts/2014-06-06-phpstorm-phpunit-custom-loader.png
[img2]: /blog/images/posts/2014-06-06-phpunit-testListener-addRiskyTest.png