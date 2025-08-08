/**
 * Keyboard Navigation Utilities
 * Enhanced keyboard navigation and accessibility features
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
}

export class KeyboardNavigationManager {
  private shortcuts: KeyboardShortcut[] = [];
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];

  constructor() {
    this.init();
  }

  private init() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('keyup', this.handleKeyup.bind(this));
    
    // Add default shortcuts
    this.addDefaultShortcuts();
    
    // Detect keyboard vs mouse usage
    this.setupKeyboardDetection();
  }

  private handleKeydown(event: KeyboardEvent) {
    // Handle escape key for closing modals/overlays
    if (event.key === 'Escape') {
      this.handleEscape();
      return;
    }

    // Handle tab key for focus management
    if (event.key === 'Tab') {
      this.handleTabNavigation(event);
    }

    // Handle arrow keys for roving tab index
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      this.handleArrowNavigation(event);
    }

    // Handle custom shortcuts
    const shortcut = this.shortcuts.find(s => 
      s.key === event.key &&
      Boolean(s.ctrlKey) === event.ctrlKey &&
      Boolean(s.altKey) === event.altKey &&
      Boolean(s.shiftKey) === event.shiftKey &&
      Boolean(s.metaKey) === event.metaKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  private handleKeyup(event: KeyboardEvent) {
    // Update visual indicators when key is released
    if (event.key === 'Alt') {
      this.hideShortcutIndicators();
    }
  }

  private handleEscape() {
    // Close any open modals, dropdowns, or overlays
    const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
    const activeDropdown = document.querySelector('[aria-expanded="true"]');
    const activeCombobox = document.querySelector('[role="combobox"][aria-expanded="true"]');
    
    if (activeModal) {
      this.closeModal(activeModal as HTMLElement);
    } else if (activeDropdown) {
      this.closeDropdown(activeDropdown as HTMLElement);
    } else if (activeCombobox) {
      this.closeCombobox(activeCombobox as HTMLElement);
    }
  }

  private handleTabNavigation(event: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = Array.from(focusableElements).indexOf(activeElement);
    
    // Handle focus trap if active
    if (this.isFocusTrapped()) {
      const trapContainer = document.querySelector('.focus-trap-active');
      if (trapContainer) {
        const trapFocusable = this.getFocusableElements(trapContainer as HTMLElement);
        this.handleFocusTrap(event, trapFocusable);
        return;
      }
    }
  }

  private handleArrowNavigation(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLElement;
    const rovingContainer = activeElement.closest('.roving-tabindex');
    
    if (rovingContainer) {
      event.preventDefault();
      this.handleRovingTabIndex(event, rovingContainer as HTMLElement);
    }
  }

  private handleRovingTabIndex(event: KeyboardEvent, container: HTMLElement) {
    const items = Array.from(container.querySelectorAll('[tabindex]'));
    const currentIndex = items.findIndex(item => item.getAttribute('tabindex') === '0');
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      default:
        return;
    }

    // Update tabindex values
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === nextIndex ? '0' : '-1');
    });

    // Focus the new item
    (items[nextIndex] as HTMLElement).focus();
  }

  private addDefaultShortcuts() {
    // Skip to main content
    this.addShortcut({
      key: 'M',
      altKey: true,
      description: 'Skip to main content',
      action: () => {
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
          (mainContent as HTMLElement).focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    // Focus search/form
    this.addShortcut({
      key: 'S',
      altKey: true,
      description: 'Focus main form',
      action: () => {
        const firstInput = document.querySelector('input:not([disabled])') as HTMLElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    });

    // Show keyboard shortcuts help
    this.addShortcut({
      key: '?',
      shiftKey: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        this.showShortcutsHelp();
      }
    });

    // Focus first focusable element
    this.addShortcut({
      key: 'Home',
      altKey: true,
      description: 'Focus first interactive element',
      action: () => {
        const firstFocusable = this.getFocusableElements()[0] as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    });

    // Focus last focusable element
    this.addShortcut({
      key: 'End',
      altKey: true,
      description: 'Focus last interactive element',
      action: () => {
        const focusableElements = this.getFocusableElements();
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
        if (lastFocusable) {
          lastFocusable.focus();
        }
      }
    });
  }

  public addShortcut(shortcut: KeyboardShortcut) {
    this.shortcuts.push(shortcut);
  }

  public removeShortcut(key: string, modifiers: Partial<Pick<KeyboardShortcut, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>> = {}) {
    this.shortcuts = this.shortcuts.filter(s => 
      !(s.key === key &&
        Boolean(s.ctrlKey) === Boolean(modifiers.ctrlKey) &&
        Boolean(s.altKey) === Boolean(modifiers.altKey) &&
        Boolean(s.shiftKey) === Boolean(modifiers.shiftKey) &&
        Boolean(s.metaKey) === Boolean(modifiers.metaKey))
    );
  }

  private getFocusableElements(container: HTMLElement = document.body): NodeListOf<HTMLElement> {
    const selector = this.focusableSelectors.join(', ');
    return container.querySelectorAll(selector);
  }

  private setupKeyboardDetection() {
    let isUsingKeyboard = false;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-user');
        document.body.classList.remove('mouse-user');
      }
    });

    document.addEventListener('mousedown', () => {
      if (isUsingKeyboard) {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-user');
        document.body.classList.add('mouse-user');
      }
    });
  }

  private isFocusTrapped(): boolean {
    return document.querySelector('.focus-trap-active') !== null;
  }

  private handleFocusTrap(event: KeyboardEvent, focusableElements: NodeListOf<HTMLElement>) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private closeModal(modal: HTMLElement) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    
    // Return focus to trigger element
    const trigger = document.querySelector('[data-modal-trigger]') as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
  }

  private closeDropdown(dropdown: HTMLElement) {
    dropdown.setAttribute('aria-expanded', 'false');
    
    // Hide dropdown content
    const content = dropdown.querySelector('[role="menu"], [role="listbox"]') as HTMLElement;
    if (content) {
      content.style.display = 'none';
    }
  }

  private closeCombobox(combobox: HTMLElement) {
    combobox.setAttribute('aria-expanded', 'false');
    
    // Hide dropdown
    const listbox = document.querySelector(`#${combobox.getAttribute('aria-controls')}`) as HTMLElement;
    if (listbox) {
      listbox.style.display = 'none';
    }
  }

  private showShortcutsHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'keyboard-shortcuts-modal';
    helpModal.setAttribute('role', 'dialog');
    helpModal.setAttribute('aria-labelledby', 'shortcuts-title');
    helpModal.setAttribute('aria-modal', 'true');
    
    const shortcuts = this.shortcuts.map(s => {
      const keys = [];
      if (s.ctrlKey || s.metaKey) keys.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
      if (s.altKey) keys.push('Alt');
      if (s.shiftKey) keys.push('Shift');
      keys.push(s.key);
      
      return `
        <div class="shortcut-item">
          <span class="shortcut-keys">${keys.join(' + ')}</span>
          <span class="shortcut-description">${s.description}</span>
        </div>
      `;
    }).join('');

    helpModal.innerHTML = `
      <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000;">
        <div class="modal-content" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; color: black; padding: 2rem; border-radius: 8px; max-width: 500px; max-height: 80vh; overflow-y: auto;">
          <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
          <div class="shortcuts-list">
            ${shortcuts}
          </div>
          <button onclick="this.closest('.keyboard-shortcuts-modal').remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Close (Escape)
          </button>
        </div>
      </div>
      <style>
        .shortcut-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }
        .shortcut-keys {
          font-family: monospace;
          background: #f5f5f5;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
        }
        .shortcut-description {
          margin-left: 1rem;
        }
      </style>
    `;

    document.body.appendChild(helpModal);
    
    // Focus the close button
    const closeButton = helpModal.querySelector('button') as HTMLElement;
    closeButton.focus();

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        helpModal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  private hideShortcutIndicators() {
    const indicators = document.querySelectorAll('.keyboard-shortcut::after');
    indicators.forEach(indicator => {
      (indicator as HTMLElement).style.opacity = '0';
    });
  }

  public enableFocusTrap(container: HTMLElement) {
    container.classList.add('focus-trap-active');
    
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }

  public disableFocusTrap(container: HTMLElement) {
    container.classList.remove('focus-trap-active');
  }

  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-announcement';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Export singleton instance
export const keyboardNavigation = new KeyboardNavigationManager();