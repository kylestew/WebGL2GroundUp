#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_modelView;
uniform mat4 u_projection;

out vec4 v_color;

void main() {
    gl_Position = u_projection * u_modelView * a_position;
    v_color = a_color;
}