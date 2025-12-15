const SIDESHIFT_API = 'https://sideshift.ai/api/v2';
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET!;
const SIDESHIFT_AFFILIATE_ID = process.env.SIDESHIFT_AFFILIATE_ID!;

export interface Coin {
  coin: string;
  networks: string[];
  name: string;
  hasMemo: boolean;
  fixedOnly: boolean | string[];
  variableOnly: boolean | string[];
  depositOffline: boolean | string[];
  settleOffline: boolean | string[];
}

export interface PairInfo {
  min: string;
  max: string;
  rate: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
}

export interface Quote {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  expiresAt: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  affiliateId: string;
}

export interface Shift {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  depositAddress: string;
  settleAddress: string;
  depositMin: string;
  depositMax: string;
  type: 'fixed' | 'variable';
  quoteId?: string;
  depositAmount?: string;
  settleAmount?: string;
  expiresAt?: string;
  status: string;
  rate?: string;
}

async function sideshiftFetch(endpoint: string, options: RequestInit = {}, userIp?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-sideshift-secret': SIDESHIFT_SECRET,
  };

  if (userIp && userIp !== '127.0.0.1' && userIp !== 'localhost' && userIp !== '::1' && !userIp.startsWith('192.168.') && !userIp.startsWith('10.') && !userIp.startsWith('172.16.')) {
    headers['x-user-ip'] = userIp;
  }

  const response = await fetch(`${SIDESHIFT_API}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.error?.message || error.message || 'SideShift API error');
  }

  return response.json();
}

export async function getCoins(): Promise<Coin[]> {
  return sideshiftFetch('/coins');
}

export async function getPair(
  depositCoin: string,
  depositNetwork: string,
  settleCoin: string,
  settleNetwork: string
): Promise<PairInfo> {
  const from = `${depositCoin}-${depositNetwork}`;
  const to = `${settleCoin}-${settleNetwork}`;
  return sideshiftFetch(`/pair/${from}/${to}`);
}

export async function createQuote(
  depositCoin: string,
  depositNetwork: string,
  settleCoin: string,
  settleNetwork: string,
  depositAmount: string,
  userIp?: string
): Promise<Quote> {
  return sideshiftFetch(
    '/quotes',
    {
      method: 'POST',
      body: JSON.stringify({
        depositCoin,
        depositNetwork,
        settleCoin,
        settleNetwork,
        depositAmount,
        affiliateId: SIDESHIFT_AFFILIATE_ID,
      }),
    },
    userIp
  );
}

export async function createFixedShift(
  quoteId: string,
  settleAddress: string,
  refundAddress?: string,
  userIp?: string
): Promise<Shift> {
  return sideshiftFetch(
    '/shifts/fixed',
    {
      method: 'POST',
      body: JSON.stringify({
        quoteId,
        settleAddress,
        refundAddress,
        affiliateId: SIDESHIFT_AFFILIATE_ID,
      }),
    },
    userIp
  );
}

export async function createVariableShift(
  depositCoin: string,
  depositNetwork: string,
  settleCoin: string,
  settleNetwork: string,
  settleAddress: string,
  refundAddress?: string,
  userIp?: string
): Promise<Shift> {
  return sideshiftFetch(
    '/shifts/variable',
    {
      method: 'POST',
      body: JSON.stringify({
        depositCoin,
        depositNetwork,
        settleCoin,
        settleNetwork,
        settleAddress,
        refundAddress,
        affiliateId: SIDESHIFT_AFFILIATE_ID,
      }),
    },
    userIp
  );
}

export async function getShift(shiftId: string, userIp?: string): Promise<Shift> {
  return sideshiftFetch(`/shifts/${shiftId}`, {}, userIp);
}