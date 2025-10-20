# Mobile Keyboard Support Test

This document describes the mobile keyboard support implemented in this PR.

## Changes Made

### 1. Bottom Margin When Keyboard is Visible

When the mobile keyboard appears, the terminal window now adds a bottom margin equal to half the viewport height. This ensures that the input area and terminal content remain visible above the keyboard.

**Implementation:**
- Added `mobileKeyboardMargin` computed property that returns `viewportHeight / 2` when keyboard is visible
- Applied this margin to the bottom padding of `.t-window` element
- The margin is dynamically calculated based on the current viewport height

**Code location:** `src/Terminal.vue` lines 224-232, 2014

### 2. Autocomplete Positioning Above Input

When the mobile keyboard is visible, the autocomplete suggestions dialog is positioned above the current input line instead of below it, ensuring it remains visible.

**Implementation:**
- Modified `_calculateTipsPos()` function to check for mobile device and keyboard visibility
- When both conditions are true, the autocomplete is forced to display above the cursor
- Falls back to default behavior (below cursor) when keyboard is not visible

**Code location:** `src/Terminal.vue` lines 1842-1857

## Testing Instructions

### Manual Testing on Real Device

1. Open the terminal on a mobile device (phone or tablet)
2. Tap on the terminal to focus the input area
3. Start typing a command
4. Observe:
   - The keyboard appears from the bottom
   - The terminal content scrolls up, maintaining visibility
   - The input line stays above the keyboard with adequate spacing
   - If autocomplete suggestions appear, they display above the input line

### How Keyboard Detection Works

The terminal uses the Visual Viewport API to detect keyboard visibility:

1. On component mount, it stores the initial viewport height
2. It listens to viewport resize events
3. When viewport height decreases by more than 150px (and width remains stable), it assumes the keyboard appeared
4. When viewport height increases back, it assumes the keyboard was hidden

**Code location:** `src/Terminal.vue` lines 340-374

### Simulating Keyboard Appearance (for Development)

Since browser dev tools don't trigger actual keyboard events, here's how to test programmatically:

```javascript
// In browser console:
// 1. Reduce viewport height significantly
window.visualViewport.dispatchEvent(new Event('resize'));

// 2. Type in the terminal to trigger autocomplete
// The autocomplete should appear above the cursor
```

## Visual Examples

### Before (Desktop)
- Terminal window has standard padding
- Autocomplete appears below cursor when space allows

### After (Mobile with Keyboard)
- Terminal window has additional bottom margin (~333px on 667px viewport)
- Autocomplete appears above cursor to avoid keyboard overlap
- Input area remains visible and accessible

## Browser Compatibility

This feature uses:
- Visual Viewport API (widely supported on mobile browsers)
- CSS computed values (universal support)
- Vue 3 reactive refs and computed properties

Fallback behavior:
- If Visual Viewport API is not available, falls back to `window.innerHeight`
- Desktop browsers are unaffected (no keyboard detection triggered)
- Older mobile browsers without Visual Viewport API will use window resize events
