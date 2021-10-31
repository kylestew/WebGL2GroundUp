#version 300 es

in vec4 position;
in vec3 normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec4 v_color;

void main() {
    gl_Position = u_projection * u_view * u_model * position;

    v_color = vec4(0.5 * (normal.xyz + 1.0), 1);
}