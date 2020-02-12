# AWS CDK Starter Project
CDK Starter application to deploy lambda via CodePipeline (with local CodeBuild and Typescript icing)

## Intro

In this article, we create a starter AWS CDK project which deploys a CodePipeline for creating a NodeJS lambda. This article is based on another [article from AWS](https://docs.aws.amazon.com/cdk/latest/guide/codepipeline_example.html), but tweaks a number of things and builds on it, specifically including local CodeBuild functionality, as well as changing the Lambda language to TypeScript.

## Background

After starting a new endeavor mid last year working with AWS for the first time, one of the first projects that I took on was to create CloudWatch alarms and dashboards for the various AWS resources that our system was going to use. We were just going live for the first time, so it was critical to have the appropriate alarms in place to notify us if something was going wrong.

The system's existing resources were defined in CloudFormation templates, however, after some research, CDK (Cloud Development Kit) from AWS was the clear way to go forward. The AWS SDK and CDK make a good combination, especially if there's information you need on existing resources in order to create new resources -- you can use the SDK to first query what's there and then use it in the CDK to build more -- perfect for my use case.

I want to use the CDK for some future personal projects, so the idea of this post is to get a basic CDK app working that automatically updates resources when commits are made to a source repository.

## Basic Cloud Development Kit App for CodePipeline and Lambda

The [setup docs](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) for CDK are easy to follow to install the CLI tools, setup your AWS credentials, and run "cdk init" to create a skeleton project in the language of your choice. Today we're using TypeScript.

A large portion of the code for my starter project is procured from this AWS CDK "CodePipeline Example" article (mentioned in intro). The AWS article includes basically just code snippets, instead of a fully functioning, downloadable repository. I've done that second part, which is the content of this repository on GitHub. The code in this aws-cdk-lambda-starter repo must be  deployed to AWS CodeCommit (or you can [integrate GitHub instead](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-webhooks-migration.html)).

I liked starting with this example because, once the CDK app is deployed, the lambda code will be deployed automatically via CodePipeline after any commits are made to the source repository. Basically, we have a CDK app and a NodeJS app (for the lambda, in a subfolder) in one repository. There are two CloudFormation stacks that are defined.

The CDK app "bootstraps" with the first PipelineDeployingLambdaStack. We have to run "cdk deploy" on local machine to deploy this into the AWS account.

After that PipelineDeployingLambdaStack deploys, it creates a CodePipeline, which is triggered anytime new commits are made to the source repository. 

The CodePipeline contains two CodeBuild projects: the first CodeBuild project builds the code that is in the "polly-client-lambda" directory, and the second creates a CF template via CDK, called "StackForLambdaDeployment" (I renamed it in my code"), which ultimately creates the lambda from the previous CodeBuild. Once the CodePipeline finished, the output of the two CodeBuild projects are used together to actually deploy the "StackForLambdaDeployment".

## Running Local CodeBuild "Hello World" Example

The CDK "CodePipeline Example" article obviously uses CodeBuild running on AWS. However, not charging time against the CodeBuild limit in Free Tier is definitely good for troubleshooting purposes. Therefore, let's [run CodeBuild locally](https://aws.amazon.com/blogs/devops/announcing-local-build-support-for-aws-codebuild/)!

When trying something new, I like to get the "Hello World" version working completely before starting to incorporate it into my workflow. Said "Hello World" local CodeBuild, which uses a Java sample application, worked for me out of the box with just a few small exceptions.

First, the tutorial has you build the openjdk8 docker image, and gives the image location as ubuntu/java/openjdk-8. After you clone the aws-codebuild-docker-images, the appropriate directory, at the time of this article is actually ubuntu/unsupported_images/java/openjdk-8.

The second issue came in building the docker image, while running the stated "docker build -t aws/codebuild/java:openjdk-8 ." -- which requires an edit to the openjdk-8 dockerfile. I got an error about the jdk version being used not existing ("E: Version '8u171-b11-2~14.04' for 'openjdk-8-jdk' was not found"), so I just removed the specific version that it was looking for in the dockerfile, and everything worked fine... changing this ...

```bash
&& apt-get install -y openjdk-${JAVA_VERSION}-jdk=$JDK_VERSION \
```

to this...

```bash
&& apt-get install -y openjdk-${JAVA_VERSION}-jdk \
```
## Running Local CodeBuild on CodePipeline Example App 

Now after getting the "hello world" local CodeBuild working, it's time to apply the same tactic to the "CodeBuild Example" CDK app we already have.

In the "CodeBuild Example" article, the buildspec for the lambda CodeBuild is defined directly within the TypeScript, as follows (this is in the lib/pipeline-stack.ts file):

```typescript
const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      install: {
        commands: [
          'cd lambda',
          'npm install',
        ],
      },
      build: {
        commands: 'npm run build',
      },
    },
    artifacts: {
      'base-directory': 'lambda',
      files: [
        'index.js',
        'node_modules/**/*',
      ],
    },
  }),
  environment: {
    buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
  },
});
```

However, we actually want to extract that code into a file, which we can then utilize to locally run the CodeBuild. So first we create a buildspec file (I called it buildspec_pollyclient.yml in the repo) in the root repository directory, with the following contents. Note that to get the local CodeBuild working, a [runtime must be supplied](https://github.com/aws-samples/aws-serverless-workshops/issues/231) in the buildspec:
```yml
version: '0.2'
phases:
  install:
    commands:
    - cd polly-client-lambda
    - npm install
    runtime-versions:
      docker: 18
  build:
    commands:
    - echo "Testing... building polly-client-lambda"
    - npm run build
artifacts:
  base-directory: polly-client-lambda
  files:
  - src/index.ts
  - dist/index.js
  - node_modules/**/*
```

Then, we need to update the lib/pipeline-stack.ts file to use the buildspec file we just created, so change the "const lambdaBuild" in the lib/pipeline-stack.ts file to pull the buildspec_pollyclient.yml file content, and then use it as the "buildSpec" value:

```typescript
const lambdaCodeBuildBuildSpec = codebuild.BuildSpec.fromSourceFilename('./buildspec_pollyclient.yml')
const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
  buildSpec: lambdaCodeBuildBuildSpec,
  environment: {
    buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
  },
});
```

If we run "cdk deploy PipelineDeployingLambdaStack", the PipelineDeployingLambdaStack will reference the newly created buildspec file for the Lambda CodeBuild.

Now for the cool part. The codebuild_build.sh file, that we downloaded earlier to run CodeBuild locally, lets us specify a custom buildspec file as a command line argument. In the following command:
* "-c" means use AWS credentials from local machine
* "-i" specifies the build docker image
* "-a" is where on local to place code artifacts after they're build.
* "-s" is the source directory where the CDK app is (which also contains the lambda directory and the buildspec file)
* "-b" is the magic that let's us specify the buildspec file to use when the CodeBuild docker runs
