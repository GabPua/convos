export default async function postRequest(url, body = null) {
  let results = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  })
  
  return results.json()
}