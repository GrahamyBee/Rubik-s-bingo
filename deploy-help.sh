#!/bin/bash

# GitHub Deployment Script for Rubix Bingo
echo "🎮 Rubix Bingo GitHub Pages Deployment Helper"
echo "============================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a Git repository"
    echo "Please run this script from the Rubix Bingo directory"
    exit 1
fi

echo "📋 To deploy your game to GitHub Pages:"
echo ""
echo "1. CREATE GITHUB REPOSITORY:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: rubix-bingo"
echo "   - Make it PUBLIC (required for free GitHub Pages)"
echo "   - Don't initialize with README"
echo "   - Click 'Create repository'"
echo ""

echo "2. CONNECT AND PUSH (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/rubix-bingo.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "3. ENABLE GITHUB PAGES:"
echo "   - Go to repository Settings → Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main / (root)"
echo "   - Click Save"
echo ""

echo "4. YOUR LIVE GAME URL:"
echo "   https://YOUR_USERNAME.github.io/rubix-bingo/"
echo ""

echo "✅ Your local repository is ready with:"
echo "   - All game files committed"
echo "   - README.md documentation"
echo "   - .gitignore for clean repository"
echo ""

echo "🚀 After following the steps above, your game will be live on GitHub Pages!"