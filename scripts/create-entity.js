const fs = require("fs");
const path = require("path");

//process.argv is representation of command enterd in cmd.
//0th element is path where node.exe is installed.
//1st element is path of terminal where command is running
//3 rd is word entered as argument of command (in our case entityName)
const entityName = process.argv[2];

if (!entityName) {
  console.error("Please provide an entity name.");
  process.exit(1);
}

const entityNameSingular = entityName.slice(0, -1).toLowerCase();
const entityFolder = path.join(__dirname, "..", "src", entityName);
const router = `${entityNameSingular}Router`;
const model = entityNameSingular[0].toUpperCase() + entityNameSingular.slice(1);
const controller = `${entityNameSingular}Controller`;

const indexContent = `
const ${model} = require('./${entityName}.model');\nconst ${controller} = require('./${entityName}.controller');\nconst ${router} = require('./${entityName}.route');\nconst ${model}Service = require("./${entityName}.service")\n\nmodule.exports = {
  ${model},
  ${controller},
  ${router},
  ${model}Service
};
`;
const modelContent = `
const mongoose = require('mongoose');\nconst { name, description, email, softDelete, createdBy, updatedBy } = require('../../common/commonDatabaseFields');\n\nconst ${entityNameSingular}Schema = new mongoose.Schema({\n    
  isActive:{
    type: Boolean,
    default: true
  },
  isDeleted: {
      type: Boolean,
      default: false
    },
  createdBy: createdBy,
  updatedBy: updatedBy,
  deletedAt: Date\n},{
  timestamps:true
});\n${entityNameSingular}Schema.methods.softDelete = function () {
  return softDelete(this); 
}\n${entityNameSingular}Schema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });\n\nmodule.exports = mongoose.model('${model}', ${entityNameSingular}Schema);\n\n
`;
const serviceContent = `
const Service = require("../../common/CommonService");\nclass ${model}Service extends Service {
  constructor(model) {
    super(model);
  }
};

module.exports = ${model}Service;
`;
const routeContent = `
const express = require('express');\nconst ${router}= express.Router();\nconst ${controller} = require("./${entityName}.controller");\n\n
${router}.get("/${entityName}",${controller}.getAll);\n${router}.get("/${entityName}/:id",${controller}.getById);\n${router}.post("/${entityNameSingular}",${controller}.create);\n${router}.put("/${entityName}/:id",${controller}.update);\n${router}.delete("/${entityName}/:id",${controller}.delete);\n\nmodule.exports = ${router};\n\n
`;
const controllerContent = `
const mongoose = require('mongoose');
const ${model} = require('./${entityName}.model');
const catchAsyncError = require('../../utils/catchAsyncError');
const ErrorHandler = require('../../utils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const Controller = require("../../common/commonController");
const ${model}Service = require('./${entityName}.service');
const ${entityNameSingular}Service = new ${model}Service(
  ${model}
);

class ${entityNameSingular}Controller extends Controller {
  constructor(service) {
    super(service);
  }
};

module.exports = new ${entityNameSingular}Controller(${entityNameSingular}Service);
`;
const files = [
  { name: "index.js", content: indexContent },
  { name: `${entityName}.model.js`, content: modelContent },
  { name: `${entityName}.controller.js`, content: controllerContent },
  { name: `${entityName}.route.js`, content: routeContent },
  { name: `${entityName}.service.js`, content: serviceContent },
];

try {
  fs.mkdirSync(entityFolder);

  files.forEach((file) => {
    const filePath = path.join(entityFolder, file.name);
    fs.writeFileSync(filePath, file.content, { encoding: "utf-8" });
    console.log(`Created ${file.name}`);
  });

  console.log(`Entity ${entityName} created successfully.`);
} catch (error) {
  console.error(`Error creating entity: ${error.message}`);
  process.exit(1);
}
