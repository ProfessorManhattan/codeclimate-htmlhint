# HTMLHint

Static code analysis tool you need for your HTML

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#table-of-contents)

## ➤ Table of Contents

- [➤ Overview](#-overview)
- [➤ Requirements](#-requirements)
  - [Optional Requirements](#optional-requirements)
- [➤ Example Usage](#-example-usage)
  - [Building the Docker Container](#building-the-docker-container)
  - [Building a Slim Container](#building-a-slim-container)
  - [Test](#test)
- [➤ Contributing](#-contributing)
- [➤ License](#-license)

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#overview)

## ➤ Overview

Code climate engine for HTMLlint

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#requirements)

## ➤ Requirements

- **[Docker](https://gitlab.com/megabyte-labs/ansible-roles/docker)**
- [CodeClimate CLI](https://github.com/codeclimate/codeclimate)

### Optional Requirements

- [DockerSlim](https://gitlab.com/megabyte-labs/ansible-roles/dockerslim) - Used for generating compact, secure images
- [Google's Container structure test](https://github.com/GoogleContainerTools/container-structure-test) - For testing the Docker images




[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#example-usage)


## ➤ Example Usage

The Code Climate engine built using this repository can be used for analysis using code climate cli. 

```shell
codeclimate analyze
```

This allows you to run code climate analysis from the root of  your project directory. Ensure `.codeclimate.yml` file is present on the root of your project directory. A sample configuration of this file  is present in this repository.Once the analysis is complete it will display the results in code climate format.

If you have created the docker image locally and wish to test it you can do so using below command

```shell
codeclimate analyze --dev
```
In order to run slim docker image of this engine , please pull the latest slim docker image locally ( or create one ) and retag it to latest before running the same.



### Building the Docker Container

Run the below make command from the root of this repository to create a local fat docker image
```shell
make image
```

### Building a Slim Container

Run the below make command from the root of this repository to create a local slim docker image
```shell
make slim
```


### Test

Run the below command from the root of this repository to test the images created by this repository.
```shell
make test
```


## ➤ Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://gitlab.com/megabyte-labs/dockerfile/ci-pipeline/ansible-lint/-/issues). If you would like to contribute, please take a look at the [contributing guide](https://gitlab.com/megabyte-labs/dockerfile/ci-pipeline/ansible-lint/-/blob/master/CONTRIBUTING.md).

<details>
<summary>Sponsorship</summary>
<br/>
<blockquote>
<br/>
I create open source projects out of love. Although I have a job, shelter, and as much fast food as I can handle, it would still be pretty cool to be appreciated by the community for something I have spent a lot of time and money on. Please consider sponsoring me! Who knows? Maybe I will be able to quit my job and publish open source full time.
<br/><br/>Sincerely,<br/><br/>

**_Brian Zalewski_**<br/><br/>

</blockquote>

<a href="https://www.patreon.com/ProfessorManhattan">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

</details>

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#license)

## ➤ License

Copyright © 2021 [Megabyte LLC](https://megabyte.space). This project is [MIT](https://gitlab.com/megabyte-labs/dockerfile/ci-pipeline/ansible-lint/-/raw/master/LICENSE) licensed.
