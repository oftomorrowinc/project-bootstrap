// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Setup ThemeToggle test mocks
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: jest.fn().mockReturnValue({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
  usePathname: () => '/',
}));

// Mock firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock Next.js server components for API routes
global.Request = global.Request || class Request {
  constructor(url, options) {
    this.url = url;
    this.options = options;
  }
  
  async json() {
    return {};
  }
};

global.Response = global.Response || class Response {
  constructor(body, options) {
    this.body = body;
    this.options = options;
    this.headers = options?.headers || {};
  }
  
  static json(data) {
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Mock NextResponse specifically
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data) => ({
      json: () => Promise.resolve(data),
      status: 200,
      headers: new Map([['Content-Type', 'application/json']])
    })
  }
}));