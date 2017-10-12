const { Router } = require('express');
const { Workbook } = require('exceljs');

const router = Router();
const timetrackingPath = '\\\\fss\\share\\TimeTracking\\2017\\October 2017 - MAC.xlsx';

router.get('/', async function(req, res) {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(timetrackingPath);

    const allocated = workbook.getWorksheet('A');
    const projects = {};
    let unassigned = 0;
    allocated.eachRow((row, number) => {
        const customer = row.getCell('A').value.result;
        const name = row.getCell('B').value.result;
        const key = `${customer} ${name}`;
        const allocated = row.getCell('J').value.result;

        if(customer && allocated) {
            const project = findOrCreateProject(projects, customer, name, allocated);
        }
    });

    new Array(31).fill().forEach((v, index) => {
        const day = createDay(index + 1);

        const worksheet = workbook.getWorksheet(day);

        worksheet.eachRow((row, number) => {
            if(number > 1) {
                const customer = getCellValue(row, 'F');
                const name = getCellValue(row, 'G');
                const ticket = getCellValue(row, 'H');

                if((customer && name) || ticket) {
                    if(customer) {
                        const project = findOrCreateProject(projects, customer, name);
                        project.workedTime += .25;
                    }
                    else {
                        unassigned += .25;
                    }
                }
            }
        })
    });

    res.send({
        projects: Object.keys(projects).map((key) => projects[key]),
        unassigned: unassigned
    });
});

function findOrCreateProject(projects, customer, name, allocated) {
    const key = `${customer} ${name}`;

    return projects[key] || (projects[key] = {
        key: key,
        customer: customer,
        name: name,
        allocatedTime: allocated || 0,
        workedTime: 0
    });
}

function getCellValue(row, cell) {
    const value = row.getCell(cell).value;

    if(value === undefined || value === null)
        return value;

    if(typeof value === 'object')
        return value.result;

    return value;
}

function createDay(dayNumber) {
    if(10 < (dayNumber % 100) && (dayNumber % 100) < 20)
        return `${dayNumber}th`;
    
    if((dayNumber % 10) === 1)
        return `${dayNumber}st`;

    if((dayNumber % 10) === 2)
        return `${dayNumber}nd`;

    if((dayNumber % 10) === 3)
        return `${dayNumber}rd`;

    return `${dayNumber}th`;
}

module.exports = router;