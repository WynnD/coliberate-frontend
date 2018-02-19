<template>
  <div
    id="app"
    class="pusher">
    <sidebar/>
    <navbar/>
    <router-view :project-data="projectData"/>
  </div>
</template>

<script>
import TopNavbar from '@/components/TopNavbar'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'App',
  components: {
    'navbar': TopNavbar,
    'sidebar': Sidebar
  },
  data () {
    return {
      projectData: {}
    }
  },
  mounted () {
    this.getProjectData()
  },
  methods: {
    getProjectData () {
      this.projectData = {
        SampleProjectID: {
          name: 'Sample Project',
          id: 'SampleProjectID',
          description: 'Project Description. We need to figure out what data goes into projects'
        },
        SampleProjectID2: {
          name: 'Sample Project # 2',
          id: 'SampleProjectID2',
          description: 'Project Description # 2. Should this be HTML, Markdown, plain text, or something else?'
        },
        SampleProjectID3: {
          name: 'Sample Project # 3',
          id: 'SampleProjectID3',
          description: 'Project Description # 3. We need to figure out what data goes into projects'
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2.85em;
}
</style>
