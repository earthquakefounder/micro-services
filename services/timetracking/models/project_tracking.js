import { Project } from './project';

const projectsVariable = new WeakMap();

class ProjectTracking {
    addProject(customer, name, allocatedTime) {
        let projects = projectsVariable.get(this);

        if(!projects)
            projectsVariable.set(this, projects);

        let project = new Project(customer, name);
        project.allocated = allocatedTime;
        
        p.push(new Project(customer, name));
    }

    addWork(customer, name, timeWorked) {

    }
}