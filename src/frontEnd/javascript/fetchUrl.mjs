const localUrl = 'http://localhost:3000'
const fetching = {}

fetching.getProjects = async () => {
  try {
    const projects = await fetch(`${localUrl}/get/projects`)
    const projectsJson = await projects.json()
    return projectsJson
  } catch (error) {
    console.error('Error on fetching the project', error)
  }
}

fetching.getProject = async (projectID) => {
  const project = await fetch(`${localUrl}/get/projects/${projectID}`)
  const projectJson = await project.json()
  return projectJson
}

fetching.getIssues = async (projectId) => {
  const issues = await fetch(`${localUrl}/get/issues/${projectId}`)
  const issuesJson = await issues.json()
  return issuesJson
}

fetching.getIssue = async (issueId) => {
  const issue = await fetch(`${localUrl}/get/issue/${issueId}`)
  const issueJson = await issue.json()
  return issueJson
}

fetching.login = async (userCredentials) => {
  try {
    const response = await fetch(`${localUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCredentials)
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error('Error logging in:', error)
    return { success: false, error }
  }
}

fetching.register = async (userInfo) => {
  try {
    const response = await fetch(`${localUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error('Error registering:', error)
    return { success: false, error }
  }
}

export default fetching
