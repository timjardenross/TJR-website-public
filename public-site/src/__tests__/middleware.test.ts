import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';
import { middleware } from '@/middleware';

const original = process.env.VERCEL_ENV;
afterEach(() => {
  if (original === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = original;
});

const request = (pathname: string) => new NextRequest(`https://example.test${pathname}`);

describe('production coming-soon lock', () => {
  it('redirects ordinary paths to /coming-soon in production', () => {
    process.env.VERCEL_ENV = 'production';
    const response = middleware(request('/about'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toMatch(/\/coming-soon$/);
  });

  it('lets the coming-soon page, robots and api calls through in production', () => {
    process.env.VERCEL_ENV = 'production';
    for (const path of ['/coming-soon', '/robots.txt', '/api/contact']) {
      expect(middleware(request(path)).headers.get('location'), path).toBeNull();
    }
  });

  it('lets every page through outside production', () => {
    process.env.VERCEL_ENV = 'preview';
    expect(middleware(request('/about')).headers.get('location')).toBeNull();
  });
});
