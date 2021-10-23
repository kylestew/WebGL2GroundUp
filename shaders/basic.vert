#version 300 es

in vec4 position;
in vec4 color;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec4 v_color;

void main() {
    // gl_Position = u_projection * u_view * u_model * position;
    gl_Position = position;
    v_color = color;
}