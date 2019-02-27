/* Constants */
export const API = '/api';
export const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

/* Utility Functions */
export function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const dateObj = date ? new Date(date) : date;
  return dateObj ? dateObj.toLocaleDateString('en-US', options) : date;
}
export function formatDateTime(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Denver', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateObj = date ? new Date(date) : date;
  return dateObj ? dateObj.toLocaleString('en-US', options).toLowerCase() : date;
}
export function formatMoney(amount, thousands = ",") {
  try {
    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(2)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + '.' + Math.abs(amount - i).toFixed(2).slice(2);
  } catch (e) {
    console.warn(e)
  }
}

/* REST communications */
function mopedREST(method, options) {
  return fetch(`${API}${options.url}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...', response);
      }
    })
}
export function mopedGET(url) {
  return mopedREST('GET', { url });
}
export function mopedPOST(url, body) {
  return mopedREST('POST', { url, body });
}
export function mopedPUT(url, body) {
  return mopedREST('PUT', { url, body });
}
export function mopedDELETE(options) {
  return mopedREST('DELETE', options);
}