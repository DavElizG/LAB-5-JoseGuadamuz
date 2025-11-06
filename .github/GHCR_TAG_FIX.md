# 🔧 GHCR Workflow Fixed - Invalid Tag Error

## ❌ The Error
```
ERROR: failed to build: invalid tag "ghcr.io/davelizg/lab-5-joseguadamuz:-4a8a4ff": 
invalid reference format
```

## 🐛 Root Cause
The `docker/metadata-action` generated an invalid tag with the format `:-4a8a4ff` (leading hyphen) because the `{{branch}}` variable was empty or malformed in the tag template `type=sha,prefix={{branch}}-`.

## ✅ Solution Applied

### Fixed: `container-grype-ghcr.yml`
Changed the tag generation from:
```yaml
type=sha,prefix={{branch}}-  # ❌ Can generate invalid tags like ":-4a8a4ff"
```

To:
```yaml
type=sha,prefix=sha-  # ✅ Always generates valid tags like "sha-4a8a4ff"
```

### NEW: `container-grype-ghcr-simple.yml` ⭐ (Recommended)
Created a simpler workflow that:
- Uses plain bash scripts instead of metadata action
- More predictable tag generation
- Easier to debug
- Same functionality, more reliable

## 🚀 Your Options (Updated)

### **Option 1: Use Simplified GHCR Workflow** ⭐ (RECOMMENDED)
**File:** `.github/workflows/container-grype-ghcr-simple.yml`

**Why this one?**
- ✅ Simpler, more reliable
- ✅ Clear tag generation logic
- ✅ Better error messages
- ✅ Easier to customize

**Tags generated:**
- `ghcr.io/davelizg/lab-5-joseguadamuz:main` (or your branch name)
- `ghcr.io/davelizg/lab-5-joseguadamuz:sha-4a8a4ff`
- `ghcr.io/davelizg/lab-5-joseguadamuz:latest` (only on main branch)

---

### **Option 2: Use Fixed Metadata-Based Workflow**
**File:** `.github/workflows/container-grype-ghcr.yml`

**Why this one?**
- Uses official Docker metadata action
- More features (semantic versioning, etc.)
- Industry standard approach

**Tags generated:**
- `ghcr.io/davelizg/lab-5-joseguadamuz:main` (or your branch name)
- `ghcr.io/davelizg/lab-5-joseguadamuz:sha-4a8a4ff`
- `ghcr.io/davelizg/lab-5-joseguadamuz:latest` (only on main branch)

---

### **Option 3: Use Docker Hub (Optional Push)**
**File:** `.github/workflows/container-grype.yml`

**Why this one?**
- Works even without Docker Hub credentials
- Builds and scans locally
- Skips push gracefully

---

## 📋 Quick Decision Guide

| What You Want | Use This File | Setup Required |
|---------------|---------------|----------------|
| **Easiest & Most Reliable** | `container-grype-ghcr-simple.yml` ⭐ | None ✅ |
| **Advanced Docker Features** | `container-grype-ghcr.yml` | None ✅ |
| **Just Build & Scan** | `container-grype.yml` | None ✅ |
| **Push to Docker Hub** | `container-grype.yml` | 2 secrets |

---

## 🎯 Recommended Action

**Use the simple GHCR workflow:**

```bash
cd /home/norman/Desktop/Uni/SeguridadInformaica/proyectoFinal/lab5/LAB-5-JoseGuadamuz

# If you want only the simple workflow (recommended)
git add .github/workflows/container-grype-ghcr-simple.yml
git commit -m "feat: Add simple GHCR workflow with Grype scanning"
git push origin main
```

**Or keep all workflows (they won't conflict):**

```bash
# All workflows can coexist
git add .github/workflows/
git commit -m "feat: Add multiple container scanning workflows"
git push origin main
```

---

## 🔍 What Changed

### Before (Broken)
```yaml
tags: |
  type=sha,prefix={{branch}}-  # Generated: ":-4a8a4ff" ❌
```

### After (Fixed - Metadata)
```yaml
tags: |
  type=sha,prefix=sha-  # Generates: "sha-4a8a4ff" ✅
```

### After (Fixed - Simple)
```bash
SHORT_SHA=$(echo "${{ github.sha }}" | cut -c1-7)
SAFE_BRANCH=$(echo "$BRANCH_NAME" | sed 's/[^a-zA-Z0-9._-]/-/g')

# Clear, predictable tags
ghcr.io/davelizg/lab-5-joseguadamuz:${SAFE_BRANCH}
ghcr.io/davelizg/lab-5-joseguadamuz:sha-${SHORT_SHA}
```

---

## 📊 Workflow Comparison

| Feature | Simple GHCR | Metadata GHCR | Docker Hub |
|---------|-------------|---------------|------------|
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Setup Time** | 0 min | 0 min | 0-15 min |
| **Debuggability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Features** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Recommended For** | Lab/Learning | Production | Distribution |

---

## ✅ Verification Steps

After pushing, check that the workflow:

1. ✅ Builds the image successfully
2. ✅ Logs in to GHCR
3. ✅ Pushes images with valid tags
4. ✅ Scans with Grype
5. ✅ Uploads SARIF results
6. ✅ Completes without tag errors

---

## 🆘 If You Still Get Errors

### Check GitHub Actions logs for:
1. **"Set image tags"** step - Should show clean tag names
2. **"Build Docker image"** step - Should complete successfully
3. **"Push Docker image"** step - Should push all tags

### Common issues:
- ❌ Branch name has special characters → Simple workflow handles this ✅
- ❌ Repository name is wrong → Check `IMAGE_NAME` in workflow
- ❌ GITHUB_TOKEN lacks permissions → Workflow sets correct permissions ✅

---

## 📚 Files Updated

1. ✅ **`container-grype-ghcr.yml`** - Fixed tag generation
2. ✨ **`container-grype-ghcr-simple.yml`** - NEW simplified workflow (recommended)
3. 📖 **`GHCR_TAG_FIX.md`** - This document

---

## 🎉 Summary

**Problem:** Invalid Docker tag format with leading hyphen
**Solution:** Fixed tag generation in both workflows
**Recommendation:** Use the simple workflow for maximum reliability

**All workflows are now fixed and ready to use! 🚀**
