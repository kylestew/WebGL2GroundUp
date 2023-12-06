#version 300 es

in vec4 position;
in vec3 normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec3 v_pos;
out vec3 v_normal;
out mat3 v_normalMatrix;

void main() {
    gl_Position = u_projection * u_view * u_model * position;
    v_pos = vec3(u_model * position);
    v_normal = normal;
    v_normalMatrix = transpose(inverse(mat3(u_model)));
}