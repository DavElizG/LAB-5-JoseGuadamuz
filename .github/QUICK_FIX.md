# 🚨 Quick Fix: Docker Hub Authentication Failed

## The Problem
```
denied: requested access to the resource is denied
```

## The Fix (5 minutes)

### Step 1: Create Docker Hub Access Token ⏱️ 2 min

1. Go to: https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Description: `GitHub Actions`
4. Permissions: **Read & Write** ✅
5. Copy the token (save it somewhere temporarily)

### Step 2: Add GitHub Secrets ⏱️ 2 min

1. Go to: https://github.com/DavElizG/LAB-5-JoseGuadamuz/settings/secrets/actions
2. Click "New repository secret"

**Secret 1:**
- Name: `DOCKERHUB_USERNAME`
- Value: Your Docker Hub username
- Click "Add secret"

**Secret 2:**
- Name: `DOCKERHUB_TOKEN`  
- Value: Paste the token from Step 1
- Click "Add secret"

### Step 3: Verify Repository Name ⏱️ 1 min

Check if `unachat/unachat` is correct:

- If your Docker Hub username is `unachat` → ✅ You're good!
- If your username is different (e.g., `johndoe`) → Update workflow:

```yaml
# In .github/workflows/container-grype.yml
env:
  DOCKERHUB_REPO: johndoe/unachat        # ← Change to your username
  IMAGE: johndoe/unachat:development     # ← Change to your username
```

### Step 4: Ensure Repository Exists

**Option A: Let GitHub Actions create it**
- The first push will create the repository automatically (if your username is correct)

**Option B: Create it manually**
1. Go to: https://hub.docker.com
2. Click "Create Repository"
3. Name: `unachat`
4. Visibility: Public or Private
5. Click "Create"

---

## Test Locally (Optional)

```bash
# From your project root
cd /home/norman/Desktop/Uni/SeguridadInformaica/proyectoFinal/lab5/LAB-5-JoseGuadamuz

# Run the test script
./.github/test-docker-hub.sh
```

This script will verify everything is configured correctly.

---

## Checklist

Before re-running the workflow:

- [ ] Created Docker Hub access token with **Read & Write** permissions
- [ ] Added `DOCKERHUB_USERNAME` secret to GitHub
- [ ] Added `DOCKERHUB_TOKEN` secret to GitHub
- [ ] Verified repository name matches Docker Hub username
- [ ] Repository exists on Docker Hub (or will be created on first push)

---

## Still Having Issues?

Check the workflow logs for these steps:

1. **"Verify Docker Hub authentication"** 
   - Should show your username
   
2. **"Push image"**
   - Will show detailed error messages

Common issues:
- ❌ Token has only "Read" permission → Need "Read & Write"
- ❌ Repository name mismatch → Update workflow to match your username
- ❌ Secrets not set → Add them in GitHub settings

---

## Need Help?

See full guide: `.github/DOCKER_HUB_SETUP.md`
