param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Get the current branch name
$branch = git rev-parse --abbrev-ref HEAD

if ($null -eq $branch -or $branch -eq "") {
    Write-Error "Could not determine the current git branch. Are you in a git repository?"
    exit 1
}

Write-Host "--- Starting auto-push for branch: $branch ---" -ForegroundColor Cyan

# Stage all changes
Write-Host "Staging changes..." -ForegroundColor Yellow
git add .

# Commit with the provided message
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "$Message"

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Nothing to commit or commit failed."
    exit $LASTEXITCODE
}

# Push to the current branch
Write-Host "Pushing to origin $branch..." -ForegroundColor Yellow
git push origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to $branch!" -ForegroundColor Green
} else {
    Write-Error "Push failed."
    exit $LASTEXITCODE
}
