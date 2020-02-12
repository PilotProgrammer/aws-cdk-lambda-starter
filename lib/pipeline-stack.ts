import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { App, Stack, StackProps } from '@aws-cdk/core';
const fs = require('fs');


export interface PipelineStackProps extends StackProps {
  readonly lambdaCode: lambda.CfnParametersCode;
}

// changes to this pipelinestack only take effect by running a cdk deploy from local machine
// merely checking this code triggers the pipeline itself, but doesn't self update the pipelinestack.
// however, checking in to this repo DOES effect changes in the lambdastack!
export class PipelineStack extends Stack {
  constructor(app: App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const code = codecommit.Repository.fromRepositoryName(this, 'ImportedRepo',
      'aws-polly-client');

    // this is the buildspec used to build the lambda function
    const lambdaCodeBuildBuildSpec = codebuild.BuildSpec.fromSourceFilename('./buildspec_pollyclient.yml')
    // const lambdaCodeBuildBuildSpec = codebuild.BuildSpec.fromObject({
    //   version: '0.2',
    //   phases: {
    //     install: {
    //       commands: [
    //         'cd polly-client-lambda',
    //         'npm install',
    //       ],
    //     },
    //     build: {
    //       commands: [
    //         'npm run build',
    //       ]
    //     },
    //   },
    //   artifacts: {
    //     'base-directory': 'polly-client-lambda',
    //     files: [
    //       'src/index.ts',
    //       'dist/index.js',
    //       'node_modules/**/*',
    //     ],
    //   },
    // });

    // this builds the lambda code from source, which is later fed into the cloudformation template that will be generated 
    // during the cdkBuild below. The output of this lambda build is utilized in the template.json file (output of cdkBuild below),
    // and the two codebuild outputs are connected during the creation of the Deploy stage in the codepipeline (defined last).
    const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
      buildSpec: lambdaCodeBuildBuildSpec,
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
    });

    // this generates the stack, via cdk, that is actually used to define the lambda.
    const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install',
              'npm install -g aws-cdk'
            ]
          },
          build: {
            commands: [
              'npm run cdk-synth'
            ],
          },
        },
        artifacts: {
          'base-directory': 'cdk.out',
          files: [
            'StackForLambdaDeployment.template.json',
          ],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
    });

    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
    const lambdaBuildOutput = new codepipeline.Artifact('LambdaBuildOutput');
    new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
              repository: code,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Lambda_Build',
              project: lambdaBuild,
              input: sourceOutput,
              outputs: [lambdaBuildOutput],
            }),
            new codepipeline_actions.CodeBuildAction({
              actionName: 'CDK_Build',
              project: cdkBuild,
              input: sourceOutput,
              outputs: [cdkBuildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CloudFormationCreateUpdateStackAction({
              actionName: 'Lambda_CFN_Deploy',
              templatePath: cdkBuildOutput.atPath('StackForLambdaDeployment.template.json'),
              stackName: 'StackForLambdaDeployment',
              adminPermissions: true,
              parameterOverrides: {
                ...props.lambdaCode.assign(lambdaBuildOutput.s3Location),
              },
              extraInputs: [lambdaBuildOutput],
              replaceOnFailure: true
            }),
          ],
        },
      ],
    });
  }
}