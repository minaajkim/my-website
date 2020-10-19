//Constants
const links = [
  {"name": "Cloudflare", "url": "https://www.cloudflare.com/" },
  {"name": "LinkedIn", "url": "https://www.linkedin.com/in/mina-a-kim/"},
  {"name": "Github", "url": "https://github.com/minakim2019"},
];
const social = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/minahskim/',
    svg: 'https://simpleicons.org/icons/instagram.svg',
  },
  {
    name: 'Github',
    url: 'https://github.com/minakim2019',
    svg: 'https://simpleicons.org/icons/github.svg',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mina-a-kim/',
    svg: 'https://simpleicons.org/icons/linkedin.svg',
  },
];

const name = 'Mina Kim';
const image = "https://github.com/minakim2019.png";

//Router
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
/**
 * Request handler to respond to the path /links, and return array of links
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.url.endsWith('/links')){
    return new Response(JSON.stringify(links), {
      headers: {'content-type': 'application/json;charset=UTF-8'},
    })
  }
  else return htmlRewriterHandler();
}

async function htmlRewriterHandler() {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8' 
    },
  }
  const res = await fetch('https://static-links-page.signalnerve.workers.dev', init)
  return new HTMLRewriter().on('div#links', new LinksTransformer(links))
    .on('title', new TitleTransformer())
    .on('div#profile', new ProfileTransformer())
    .on('img#avatar', new ImageTransformer(image))
    .on('h1#name', new NameTransformer(name))
    .on('div#social', new SocialTransformer())
    .on('body', new BackgroundTransformer())
    .transform(res);
}

/*TRANSFORMERS*/
//add icons
class SocialTransformer {
  constructor(social) {
    this.social = social
  }
  async element(element) {
    element.removeAttribute('style')
    social.forEach(link => {
      element.append(`<a href="${link.url}"><img src=${link.svg}></a>`, { html: true })
    })
  }
}
class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true })
    })
  }
}
//Remove display: none from div#profile container
class ProfileTransformer {
  async element(element) {
    element.removeAttribute('style')
  }
}

//Sets name
class NameTransformer {
  constructor(name) {
    this.name = name
  }
  async element(element) {
    element.setInnerContent(this.name);
  }
}
//Sets avatar
class ImageTransformer{
  constructor(image) {
    this.image = image
  }
  async element(element) {
    element.setAttribute('src', this.image); 
  }
}
//Sets background color
class BackgroundTransformer {
  async element(element) {
    element.setAttribute('class', 'bg-indigo-200')
  }
}
//Sets title
class TitleTransformer {
  async element(element) {
    element.setInnerContent("Mina Kim")
  }
}