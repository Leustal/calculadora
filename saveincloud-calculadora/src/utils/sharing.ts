import type {
  Infrastructure,
} from '../types/infrastructure';

const QUERY_KEY = 'config';

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function decodeBase64(value: string): string {
  const normalized =
    value
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  const padded =
    normalized +
    '='.repeat(
      (4 - (normalized.length % 4)) % 4
    );

  const binary =
    atob(padded);

  const bytes = Uint8Array.from(
    binary,
    (character) =>
      character.charCodeAt(0)
  );

  return new TextDecoder().decode(
    bytes
  );
}

export function encodeInfrastructure(
  infrastructure: Infrastructure
): string {
  return encodeBase64(
    JSON.stringify(
      infrastructure
    )
  );
}

export function decodeInfrastructure(
  encoded: string
): Infrastructure | null {
  try {
    const parsed = JSON.parse(
      decodeBase64(encoded)
    );

    if (
      !parsed ||
      !Array.isArray(
        parsed.nodes
      )
    ) {
      return null;
    }

    return parsed as Infrastructure;
  } catch {
    return null;
  }
}

export function getSharedInfrastructure(): Infrastructure | null {
  const encoded =
    new URLSearchParams(
      window.location.search
    ).get(QUERY_KEY);

  if (!encoded) {
    return null;
  }

  return decodeInfrastructure(
    encoded
  );
}

export function createShareUrl(
  infrastructure: Infrastructure
): string {
  const url =
    new URL(
      window.location.href
    );

  url.search = '';
  url.hash = '';
  url.searchParams.set(
    QUERY_KEY,
    encodeInfrastructure(
      infrastructure
    )
  );

  return url.toString();
}
