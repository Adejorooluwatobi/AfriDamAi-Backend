"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecialistDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_specialist_dto_1 = require("./create-specialist.dto");
class UpdateSpecialistDto extends (0, swagger_1.PartialType)(create_specialist_dto_1.CreateSpecialistDto) {
}
exports.UpdateSpecialistDto = UpdateSpecialistDto;
//# sourceMappingURL=update-specialist.dto.js.map