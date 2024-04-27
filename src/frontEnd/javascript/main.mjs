import fetchUrl from './fetchUrl.mjs'

const main = {}

export default main

/**
 * Creates and returns a new HTML element with specified options.
 * @param {string} type - The type of the HTML element to be created
 * @param {object} [options] - Optional parameters to customize the element
 * @returns {HTMLElement} The newly created HTML element with the specified options applied.
 */
function createElement (type, options = {}) {
  const {
    classes,
    id,
    text,
    src,
    alt,
    style,
    onClick
  } = options
  const element = document.createElement(type)
  if (classes) element.className = classes
  if (id) element.id = id
  if (text) element.innerText = text
  if (src) element.src = src
  if (alt) element.alt = alt
  if (style) Object.assign(element.style, style)
  if (onClick) element.addEventListener('click', onClick)
  return element
}

// Function to clear the content of the main element
main.clearBody = () => {
  document.getElementById('main').innerHTML = ''
}

// Function to create the home page
main.createHome = async (showMain = false) => {
  main.clearBody()
  if (showMain) {
    document.body.insertBefore(main.createHeader(), document.body.firstChild)
  }
  main.createStartDiv()
}

main.createStartDiv = () => {
  const h1 = createElement('h1', {
    text: 'Welcome to GitLab'
  })
  const descriptionText = createElement('p', {
    text: `In this assignment, I wrote a web application where I have to include real-time web technologies.
I should publish my application on a real (public) production server.
The idea behind the application is that should be able to list issues from a GitLab repository through the GitLab REST API and GitLabs Webhooks.`
  })
  const descriptionBox = createElement('div', {
    classes: 'card'
  })
  descriptionBox.appendChild(descriptionText)

  const img = createElement('img', {
    src: './images/issueTracker.webp',
    alt: 'Issue Tracker',
    style: {
      width: '50%'
    }
  })

  const mainElement = document.getElementById('main');
  [h1, img, descriptionBox].forEach(el => mainElement.appendChild(el))
}

main.createHeader = () => {
  const header = createElement('header', {
    classes: 'header'
  })
  const flashMessage = createElement('div', {
    id: 'flashMessage',
    classes: 'flashMessage',
    style: {
      display: 'none'
    }
  })
  const topDiv = createElement('div', {
    id: 'topDiv',
    classes: 'topDiv'
  })

  topDiv.appendChild(header)
  topDiv.appendChild(flashMessage)
  header.appendChild(main.createNavbar())

  return topDiv
}

main.createNavbar = () => {
  const navbar = createElement('nav', {
    classes: 'navbar'
  })

  const createNavItem = (src, alt, onClick) => {
    const item = createElement('a', {
      classes: alt.toLowerCase(),
      onClick
    })
    const img = createElement('img', {
      src,
      alt
    })
    item.appendChild(img)
    return item
  }

  navbar.appendChild(createNavItem('/images/home.jpg', 'Home', () => {
    main.createHome()
    window.history.pushState({}, '', '/home')
  }))

  navbar.appendChild(createNavItem('/images/issues.jpg', 'Projects', () => {
    window.history.pushState({}, '', '/get/projects')
    main.createProjectsPage()
  }))

  return navbar
}

main.createProjectsPage = async () => {
  main.clearBody()
  const projects = await fetchUrl.getProjects()

  if (!Array.isArray(projects)) {
    console.error('Projects data is not an array:', projects)
    return
  }

  projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  const projectsDiv = createElement('div', {
    classes: 'projectsDiv'
  })
  projects.forEach(project => projectsDiv.appendChild(main.createProject(project)))

  document.getElementById('main').appendChild(projectsDiv)
}

main.createProject = (project) => {
  const mainDiv = createElement('div', {
    classes: 'mainDiv'
  })
  const projectDiv = createElement('div', {
    classes: 'projectDiv',
    id: project.id
  })
  const projectName = createElement('h2', {
    classes: 'projectName',
    text: project.name
  })
  const lastActivityAt = createElement('p', {
    classes: 'lastActivityAt',
    text: `Last activity at: ${new Date(project.last_activity_at).toLocaleString()}`
  })
  const btn = createElement('button', {
    classes: 'btn',
    text: 'More info',
    onClick: () => {
      window.history.pushState({}, '', `/projects/${project.id}/issues`)
      main.createProjectDiv(project.id)
    }
  })

  projectDiv.appendChild(projectName)
  projectDiv.appendChild(lastActivityAt)
  mainDiv.appendChild(projectDiv)
  mainDiv.appendChild(createElement('div', {
    classes: 'btnDiv'
  }).appendChild(btn))

  return mainDiv
}

main.createProjectDiv = async (id) => {
  main.clearBody()
  const project = await fetchUrl.getProject(id)
  const issues = await fetchUrl.getIssues(id)

  if (!Array.isArray(issues)) {
    console.error('Issues data is not an array:', issues)
    return
  }

  issues.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  document.getElementById('main').appendChild(main.createIssuesDiv(project, issues))
}

main.createIssuesDiv = (project, issues) => {
  const issueDiv = createElement('div', {
    classes: 'issueDiv'
  })
  issueDiv.innerHTML = `<h2 class="projectName">${project.name}</h2>
  <p class="projectDescription">${project.description || 'There is no description in this project'}</p>`

  if (issues.length === 0) {
    issueDiv.appendChild(createElement('p', {
      classes: 'issues',
      text: 'There is no issues created in this project'
    }))
    return issueDiv
  }

  const issuesDiv = createElement('div', {
    classes: 'issuesDiv'
  })
  issues.forEach(issue => issuesDiv.appendChild(main.createIssueDiv(issue)))
  issueDiv.appendChild(issuesDiv)

  return issueDiv
}

main.createIssueDiv = (issue) => {
  const issueDiv = createElement('div', {
    classes: `issueDiv ${issue.id}`
  })
  issueDiv.innerHTML = `<div class="issueTop"><h3 class="issueTitle">Issue Name: ${issue.title}</h3>
  <p class="issueState">State: ${issue.state}</div><p class="issueDescription">${issue.description ? `Description: ${issue.description}` : 'There is not any description in this issue'}</p>
  <p class="issueCreatedAt">Created at: ${new Date(issue.created_at).toLocaleString()}</p>
  <p class="issueUpdatedAt">Updated at: ${new Date(issue.updated_at).toLocaleString()}</p>`

  return issueDiv
}
