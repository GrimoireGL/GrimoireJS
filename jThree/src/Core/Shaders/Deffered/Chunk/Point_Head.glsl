#define POINT_LIGHT_MAX 5
uniform vec3 pl_pos[POINT_LIGHT_MAX];
uniform vec4 pl_col[POINT_LIGHT_MAX];
uniform vec2 pl_coef[POINT_LIGHT_MAX];//(decay,distance)
uniform int pl_count;