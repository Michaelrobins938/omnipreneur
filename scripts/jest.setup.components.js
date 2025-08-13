// Jest setup specifically for component tests with JSDOM environment
import '@testing-library/jest-dom'
import 'jest-extended'

// Mock localStorage for browser environment tests
const mockLocalStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null
  },
  setItem: function(key, value) {
    this.store[key] = String(value)
  },
  removeItem: function(key) {
    delete this.store[key]
  },
  clear: function() {
    this.store = {}
  }
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock WebSocket for component tests
global.WebSocket = class MockWebSocket {
  constructor(url) {
    this.url = url
    this.readyState = 1 // OPEN
    setTimeout(() => {
      if (this.onopen) this.onopen({})
    }, 0)
  }
  
  send(data) {
    // Mock send functionality
  }
  
  close() {
    this.readyState = 3 // CLOSED
    if (this.onclose) this.onclose({})
  }
}

// Mock IntersectionObserver
global.IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Suppress console.error for tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
}