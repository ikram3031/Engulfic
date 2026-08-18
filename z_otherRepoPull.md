# Pulling Changes from Another Repository

This note explains how to pull updates from a different Git repository into your current repository.

## 1. Add the other repository as a remote

If you want to pull from another repository, add it as a remote first:

```bash
git remote add upstream <other-repo-url>
```

Example:

```bash
git remote add upstream https://github.com/owner/other-repo.git
```

## 2. Fetch the remote changes

```bash
git fetch upstream
```

## 3. Switch to the branch you want to update

```bash
git checkout main
```

## 4. Merge or rebase the fetched changes

### Merge

```bash
git merge upstream/main
```

### Rebase (often cleaner)

```bash
git pull --rebase upstream main
```

## 5. If there are conflicts

Resolve the conflicted files, then:

```bash
git add .
git rebase --continue
```

or, if you used merge:

```bash
git add .
git commit
```

## 6. Useful commands

Check remotes:

```bash
git remote -v
```

Check status:

```bash
git status
```

## Notes

- This is commonly used when you fork a repository and want to sync with the original one.
- Using `upstream` as the remote name is a common convention.
- If you are working on another branch, replace `main` with your target branch name.
