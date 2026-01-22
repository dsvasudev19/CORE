# Troubleshooting Guide

## Common Issues and Solutions

### CSS/Tailwind Errors

#### Error: "The `border-border` class does not exist"

**Solution**: ✅ Fixed! The globals.css has been updated to remove invalid Tailwind classes.

#### Error: "Module not found: Can't resolve '@/...'"

**Solution**: Ensure tsconfig.json has the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Dependency Issues

#### Error: "No matching version found for @react-three/fiber"

**Solution**: ✅ Fixed! Three.js dependencies have been removed as they're not needed for the current implementation.

#### Error: "Peer dependency warnings"

**Solution**: These are warnings and won't prevent the app from running. You can safely ignore them or run:

```bash
pnpm install --force
```

### Build Errors

#### Error: "Module parse failed"

**Solution**: Clear the Next.js cache:

```bash
rm -rf .next
pnpm dev
```

#### Error: "Cannot find module 'framer-motion'"

**Solution**: Reinstall dependencies:

```bash
rm -rf node_modules
pnpm install
```

### Runtime Errors

#### Error: "Hydration failed"

**Solution**: This usually happens with client-side only features. Ensure all interactive components have `"use client"` directive at the top.

#### Error: "useMouseEnter must be used within a MouseEnterProvider"

**Solution**: Ensure CardItem components are wrapped inside CardContainer.

### Development Server Issues

#### Port 3000 already in use

**Solution**:

```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
pnpm dev -- -p 3001
```

#### Changes not reflecting

**Solution**:

1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Restart dev server

### Performance Issues

#### Slow page load

**Solution**:

1. Check network tab in DevTools
2. Ensure images are optimized
3. Run production build to test: `pnpm build && pnpm start`

#### Animations stuttering

**Solution**:

1. Reduce animation complexity
2. Use `will-change` CSS property sparingly
3. Check browser GPU acceleration

### Styling Issues

#### Tailwind classes not working

**Solution**:

1. Ensure tailwind.config.ts includes all content paths
2. Restart dev server
3. Check for typos in class names

#### Dark mode not working

**Solution**: Ensure `className="dark"` is on the `<html>` tag in layout.tsx

### TypeScript Errors

#### Error: "Cannot find name 'React'"

**Solution**: Add import at top of file:

```typescript
import React from "react";
```

#### Error: "Property does not exist on type"

**Solution**: Check component prop types and ensure they match usage.

## Quick Fixes

### Reset Everything

```bash
# Clean all caches and dependencies
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Check Installation

```bash
# Verify all dependencies are installed
pnpm list

# Check for outdated packages
pnpm outdated
```

### Verify Configuration

```bash
# Check if all config files exist
ls -la tailwind.config.ts
ls -la postcss.config.mjs
ls -la tsconfig.json
```

## Getting Help

If you're still experiencing issues:

1. **Check the console**: Open browser DevTools (F12) and check for errors
2. **Check terminal**: Look for build errors in the terminal
3. **Review documentation**: Check README.md and FEATURES.md
4. **Test in production**: Run `pnpm build` to see if it's a dev-only issue

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Debugging
pnpm lint             # Check for linting errors
pnpm check-types      # Check TypeScript types

# Cleaning
rm -rf .next          # Clear Next.js cache
rm -rf node_modules   # Remove dependencies
pnpm install          # Reinstall dependencies
```

## Browser DevTools Tips

### Check Network

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)

### Check Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors (red) or warnings (yellow)

### Check Elements

1. Open DevTools (F12)
2. Go to Elements tab
3. Inspect element styles
4. Check if Tailwind classes are applied

## Environment-Specific Issues

### macOS

- Ensure Xcode Command Line Tools are installed
- Check file permissions: `chmod -R 755 .`

### Windows

- Use Git Bash or WSL for better compatibility
- Check line endings (CRLF vs LF)

### Linux

- Ensure Node.js is installed via nvm or official package
- Check file permissions

## Still Having Issues?

Create a minimal reproduction:

1. Create a new Next.js app
2. Copy one component at a time
3. Identify which component causes the issue
4. Check that component's dependencies

---

**Last Updated**: After fixing globals.css border-border issue
