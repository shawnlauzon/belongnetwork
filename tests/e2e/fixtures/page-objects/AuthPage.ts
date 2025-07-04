import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class AuthPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly firstNameInput: Locator
  readonly signInButton: Locator
  readonly signUpButton: Locator
  readonly signOutButton: Locator
  readonly toggleAuthMode: Locator
  readonly authStatus: Locator
  readonly userEmail: Locator
  readonly userId: Locator
  readonly authError: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.firstNameInput = page.getByTestId('first-name-input')
    this.signInButton = page.getByTestId('sign-in-button')
    this.signUpButton = page.getByTestId('sign-up-button')
    this.signOutButton = page.getByTestId('sign-out-button')
    this.toggleAuthMode = page.getByTestId('toggle-auth-mode')
    this.authStatus = page.getByTestId('auth-status')
    this.userEmail = page.getByTestId('user-email')
    this.userId = page.getByTestId('user-id')
    this.authError = page.getByTestId('auth-error')
  }

  async goto() {
    await this.page.goto('/auth')
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }

  async signUp(email: string, password: string, firstName?: string) {
    await this.toggleAuthMode.click()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    if (firstName) {
      await this.firstNameInput.fill(firstName)
    }
    await this.signUpButton.click()
  }

  async signOut() {
    await this.signOutButton.click()
  }

  async isAuthenticated() {
    // Get the platform's authentication state from the data attribute
    const authContainer = this.page.getByTestId('auth-container')
    const isAuthenticatedAttr = await authContainer.getAttribute('data-is-authenticated')
    return isAuthenticatedAttr === 'true'
  }

  async getAuthError() {
    try {
      return await this.authError.textContent()
    } catch {
      return null
    }
  }

  async getUserEmail() {
    const text = await this.userEmail.textContent()
    return text?.replace('Email: ', '') || null
  }

  async getUserId() {
    const text = await this.userId.textContent()
    return text?.replace('ID: ', '') || null
  }
}