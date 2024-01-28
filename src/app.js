import 'dotenv/config';

import controller from './controllers/statutesController.js';

await controller.initILCSCollection();