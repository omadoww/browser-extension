export default function ({ type, target }) {
  if (type !== 'proxy') {
    return {
      url: `https://githublinker.herokuapp.com/q/${type}/${target}`,
      method: 'GET',
    };
  }

  return {
    url: `https://githublinker.herokuapp.com/redirect?url=${target}`,
    method: 'GET',
  };
}
