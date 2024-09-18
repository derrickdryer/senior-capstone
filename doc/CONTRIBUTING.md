# Contributing Guidelines

Contributions to this project are currently restricted. Only the authors and contributors listed below are allowed to make changes and merge branches. Due to the nature of this project our team will not be adding more contributors.

## Branches

This project has designated branches to ensure that sufficient testing is completed before any code is merged into the `master` branch.

### `master`

Master is the production branch where all final versions of the project are pushed when sufficient testing is completed and is at a stage where that feature can be showcased without major errors. Pull requests must be made in order to merge into this branch, pull requests must then get reviewed before being merged.

### `testing`

This branch is where all code goes to gets tested before a pull request is made to merge code into `master`. Pull requests must be made to merge code to this branch and does not require approval.

### `feature-<feature name>`

All features are required to follow the above naming convention.

### `fix-<issue number>`

All fixes for issue tickets must follow the above naming convention.

## Project Workflow

This project follows a `branch-and-pull` workflow.

1. Contributors create a local copy of the repo using wither HTTPS or SSH with the `git clone` command.
2. Create a local branch with the following command: `git checkout -b BRANCH_NAME`. Make sure your local branch follow the above naming convention.
3. Make sufficient changes, perform `git add FILES` and `git commit -m "MESSAGE"` often to track changes locally.
4. When sufficient changes are made or feature/fix is completed push your branch to the repo `git push -u origin BRANCH_NAME`.

![Workflow](/images/Workflow.png)

## Pull Requests

All issues and features must create a pull request to merge into the `testing` branch and must have sufficient documentation indicating what the pull request is for, what issues it solves/features it adds and lastly if any testing has been performed on the code. Please follow pull request template.
