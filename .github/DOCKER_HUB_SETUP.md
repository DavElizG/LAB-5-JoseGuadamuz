# Docker Hub Setup Guide

## Current Issue
The workflow fails with: `denied: requested access to the resource is denied`

This means Docker Hub is rejecting the push attempt due to authentication or permission issues.

---

## Step-by-Step Fix

### 1. Create Docker Hub Repository (if it doesn't exist)

**Option A: Via Docker Hub Web Interface**
1. Go to https://hub.docker.com
2. Click "Create Repository"
3. Repository name: `unachat`
4. Visibility: Choose "Public" or "Private"
5. Click "Create"

**Option B: Via Docker CLI (locally)**
```bash
# Login to Docker Hub
docker login

# Create repository by pushing an image
docker tag unachat/unachat:development YOUR_USERNAME/unachat:development
docker push YOUR_USERNAME/unachat:development
```

---

### 2. Generate Docker Hub Access Token

1. Go to https://hub.docker.com/settings/security
2. Click **"New Access Token"**
3. Description: `GitHub Actions - UNA-Chat`
4. Access permissions: **"Read & Write"** (or "Read, Write, & Delete")
5. Click **"Generate"**
6. **IMPORTANT**: Copy the token immediately (you won't see it again)

---

### 3. Configure GitHub Secrets

1. Go to your GitHub repository: https://github.com/DavElizG/LAB-5-JoseGuadamuz
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add/Update these secrets:

#### `DOCKERHUB_USERNAME`
- Click "New repository secret"
- Name: `DOCKERHUB_USERNAME`
- Value: Your Docker Hub username (e.g., `johndoe`)
- Click "Add secret"

#### `DOCKERHUB_TOKEN`
- Click "New repository secret"
- Name: `DOCKERHUB_TOKEN`
- Value: Paste the access token you generated in Step 2
- Click "Add secret"

---

### 4. Verify Repository Name Matches

The workflow uses: `unachat/unachat`

**Check if this matches your Docker Hub account:**

- If your Docker Hub username is `unachat` → ✅ Correct
- If your Docker Hub username is different (e.g., `myusername`) → ❌ Need to update

**To fix repository name mismatch:**

Update `.github/workflows/container-grype.yml`:

```yaml
env:
  DOCKERHUB_REPO: YOUR_ACTUAL_USERNAME/unachat  # ← Change this
  IMAGE: YOUR_ACTUAL_USERNAME/unachat:development
```

---

### 5. Verify Token Permissions

Your Docker Hub token must have **Read & Write** permissions.

**To check:**
1. Go to https://hub.docker.com/settings/security
2. Find your token
3. Verify it says "Read & Write" (not just "Read")
4. If wrong permissions, delete and create a new token

---

### 6. Test Locally (Optional)

Before pushing to GitHub, test Docker Hub access locally:

```bash
# Login with your token
echo "YOUR_TOKEN" | docker login -u YOUR_USERNAME --password-stdin

# Build image
docker build -t YOUR_USERNAME/unachat:test .

# Try to push
docker push YOUR_USERNAME/unachat:test

# If successful, delete test tag
docker rmi YOUR_USERNAME/unachat:test
```

---

## Common Issues & Solutions

### Issue 1: "denied: requested access to the resource is denied"
**Causes:**
- Repository doesn't exist on Docker Hub
- Wrong username in repository path
- Token doesn't have write permissions
- Token expired or invalid

**Solution:** Follow Steps 1-4 above

---

### Issue 2: "unauthorized: incorrect username or password"
**Causes:**
- `DOCKERHUB_USERNAME` secret is wrong
- `DOCKERHUB_TOKEN` secret is wrong or expired

**Solution:** Regenerate token (Step 2) and update secrets (Step 3)

---

### Issue 3: Repository name mismatch
**Example:** Username is `johndoe` but workflow uses `unachat/unachat`

**Solution:**
Either:
- Create a Docker Hub organization called `unachat` and add repository there
- OR update workflow to use `johndoe/unachat`

---

## Verification Checklist

Before running the workflow again:

- [ ] Docker Hub repository exists: https://hub.docker.com/r/unachat/unachat
- [ ] `DOCKERHUB_USERNAME` secret is set correctly
- [ ] `DOCKERHUB_TOKEN` secret is set with a valid token
- [ ] Token has **Read & Write** permissions
- [ ] Repository name in workflow matches your Docker Hub username/organization
- [ ] You are the owner or have push access to the repository

---

## Workflow Updates Made

The workflow now includes:

1. **Docker login verification** - Confirms authentication succeeded
2. **Better error messages** - Shows exactly what to check if push fails
3. **Debug output** - Displays images being pushed

---

## Need More Help?

If issues persist, check the workflow logs for:

1. **"Verify Docker Hub authentication"** step
   - Should show your username
   - Should confirm you're logged in

2. **"Debug - Show built image"** step
   - Confirms image was built locally
   - Shows image size and ID

3. **"Push image"** step
   - Shows which specific push command failed
   - Provides checklist of things to verify

---

## Security Best Practices

✅ **DO:**
- Use access tokens (not passwords)
- Set minimum required permissions on tokens
- Rotate tokens periodically
- Use different tokens for different projects

❌ **DON'T:**
- Commit tokens to code
- Share tokens via email/chat
- Use admin/full-access tokens when read-write is enough
- Reuse personal passwords as tokens

---

**Last Updated:** November 5, 2025
