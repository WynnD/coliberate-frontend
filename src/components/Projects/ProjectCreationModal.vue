<template>
  <div class="ui modal">
    <div class="header">Add a Project</div>
    <div class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>

          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name:</div>
                <input
                  type="text"
                  placeholder="Project Name">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">ID:</div>
                <div class="ui basic button disabled">
                  Project ID is based off of project name?
                </div>
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Description:</div>
                <input
                  type="text"
                  placeholder="Project Description">
              </div>
            </div>
          </div>
        </div>

        <div class="ui segment">
          <div class="ui header">Group Members</div>
          Group and Role Selectors go here
        </div>

        <div class="ui segment">
          <div class="ui header">Project Infrastructure</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Predicted Start Date:</div>
                <input
                  type="date"
                  placeholder="Start Date">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Default Sprint Length:</div>
                <input
                  type="number"
                  value="14">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui approve button">Add</div>
      <div class="ui cancel button">Cancel</div>
    </div>
  </div>
</template>
