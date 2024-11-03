# Shader Park Builder

A visual builder for creating and composing [Shader Park](https://shaderpark.com/) shaders. Build complex shaders using a library of predefined elements and custom snippets.

<img width="2056" alt="Screenshot 2024-11-02 at 11 55 46 PM" src="https://github.com/user-attachments/assets/bea1c121-7ca5-4e22-b5b6-6fa94a7be5a6">

<img width="2056" alt="Screenshot 2024-11-02 at 11 56 36 PM" src="https://github.com/user-attachments/assets/174b1aec-7a37-468b-9464-d46f4c9e14fc">

## About Shader Park

This project is built on top of [Shader Park](https://shaderpark.com/), an incredible platform that makes creating shaders accessible through a JavaScript API. Shader Park was created by [Torin Blankensmith](https://github.com/torinmb) and [Peter Whidden](https://github.com/pwhiddy).

Key Shader Park Resources:
- [Shader Park Website](https://shaderpark.com/)
- [Shader Park Documentation](https://docs.shaderpark.com/)
- [Shader Park GitHub](https://github.com/shader-park)
- [Shader Park Examples](https://shaderpark.com/examples)
- [Shader Park Discord](https://discord.gg/9GZMbDgNFE)

## Features

### Core Functionality
- [x] Visual shader composition using Shader Park's JavaScript API
- [x] Live preview with Three.js integration
- [x] Real-time code generation
- [x] Parameter controls with animation support
- [x] Custom snippet system
- [x] Dark/Light mode

### Element Library
- [x] Geometry primitives (box, sphere, torus, etc.)
- [x] Material controls
- [x] Color controls
- [x] Space transformations
- [x] Modifiers
- [x] Utility functions

### Environment System
- [x] Multiple preview environments
- [x] Environment controls
- [x] Studio lighting setup
- [x] Custom environment parameters

### User Interface
- [x] Resizable panels
- [x] Collapsible sections
- [x] Search functionality
- [x] Parameter animations
- [x] Notes system
- [x] Settings panel

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shader-park
   ```

2. Install dependencies:
   ```bash
   cd shader-park-builder
   yarn install
   ```

## Development
Run the development server:

### Development mode  
`yarn start`

### Production mode
`yarn run build`

## Roadmap

### Current Sprint
- [x] Copy code button
- [x] Basic theming support
  - [x] Light/Dark mode toggle
  - [x] Theme settings panel
  - [x] Persistent theme preference
- [x] Left panel reorganization
  - [x] Collapsible sections with arrows
  - [x] Resizable panels
  - [x] Library/Presets/Notes tabs
  - [x] Scrollable content
  - [x] Multi-note system with add/delete
- [ ] Drag-and-drop reordering
- [ ] Basic preset system

### Recent Updates
#### Environment System
- Added multiple 3D environments for shader preview:
  - [x] Ocean environment with animated water and floating platform
  - [x] Sky environment with dynamic lighting and ground plane
  - [x] Studio environment with grid floor and fog
  - [x] Plain background option
- Added shadow support across all environments
- Added proper lighting setup for each environment
- Added ground/platform to each environment for better spatial reference

#### UI Improvements
- Added toolbar with application title and settings
- Implemented theme switcher with light/dark modes
- Reorganized left panel into three sections:
  1. Library - Scrollable element catalog with search
  2. Presets - Quick access to saved configurations (in progress)
  3. Notes - Multi-note support with add/edit/delete capabilities
- Added resizable dividers between panel sections
- Improved scrolling behavior for overflow content
- Added dark mode support throughout the application
- Made library elements more compact with grid layout
- Added preset system with JSON storage
- Improved notes system with collapsible entries
- Added custom snippet creation functionality
- Updated UI for better space utilization

### Next Up
- [ ] Environment enhancements
  - [ ] Environment-specific controls
  - [ ] Custom environment parameters
  - [ ] Environment presets
- [ ] Preset system implementation
  - [x] Preset storage structure
  - [ ] Save/load functionality
  - [ ] Preset management UI
- [x] Custom snippet creation
- [ ] Drag-and-drop element reordering

### Documentation Integration
- [ ] Built-in documentation viewer
- [ ] Quick reference panel
- [ ] Context-sensitive help

### Element Library Expansion
- [ ] Operation modes (union, difference, etc.)
- [ ] Complex multi-line elements
- [ ] Noise-based displacement presets
- [ ] Complete Shader Park API coverage

### User Elements & Snippets
- [ ] Save custom elements
- [ ] Import/Export snippets
- [ ] Snippet organization system

### Theming & UI
- [ ] Dark/Light mode toggle
- [ ] Custom color schemes
- [ ] Configurable UI layouts
- [ ] Responsive panel system

### Preview Environment
- [ ] Multiple background scenes
- [ ] Environment presets
- [ ] Custom environment import
- [ ] Environment editor

### User Data Management
- [ ] Notes system
- [ ] Preset library
- [ ] Tags and search
- [ ] Import/Export system

### Code Management
- [ ] Copy code button
- [ ] Code formatting options
- [ ] Drag-and-drop element reordering
- [ ] Code history/undo system

### Layout & Organization
- [ ] Customizable panel layouts
- [ ] Collapsible sections
- [ ] Element grouping
- [ ] Workspace presets
