// Uncomment the code below and write your tests
import path from 'path';
import fs from 'fs';
import promises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');
    await readFileAsynchronously(`/test`);
    expect(joinSpy).toBeCalledWith(__dirname, `/test`);
  });

  test('should return null if file does not exist', async () => {
    fs.existsSync = jest.fn().mockReturnValue(false);
    expect(await readFileAsynchronously(`/test`)).toBeNull();
  });

  test('should return file content if file exists', async () => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    promises.readFile = jest.fn().mockResolvedValue('file content');
    expect(await readFileAsynchronously(`/test`)).toBe('file content');
  });
});
