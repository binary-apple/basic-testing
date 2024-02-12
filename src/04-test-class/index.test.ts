// Uncomment the code below and write your tests
import {
  InsufficientFundsError,
  SynchronizationFailedError,
  getBankAccount,
} from '.';
import _ from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(100).getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      getBankAccount(100).withdraw(200);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => {
      getBankAccount(100).transfer(200, getBankAccount(0));
    }).toThrow();
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);
    expect(() => {
      bankAccount.transfer(10, bankAccount);
    }).toThrow();
  });

  test('should deposit money', () => {
    expect(getBankAccount(100).deposit(50).getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    expect(getBankAccount(200).withdraw(100).getBalance()).toBe(100);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(100);
    const accountToTransferTo = getBankAccount(0);
    bankAccount.transfer(10, accountToTransferTo);
    expect(bankAccount.getBalance()).toBe(90);
    expect(accountToTransferTo.getBalance()).toBe(10);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    _.random = jest.fn().mockReturnValueOnce(50).mockReturnValueOnce(1);
    expect(typeof (await getBankAccount(100).fetchBalance())).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(100);
    bankAccount.fetchBalance = jest.fn().mockResolvedValue(50);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(100);
    bankAccount.fetchBalance = jest.fn().mockResolvedValue(null);
    expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
