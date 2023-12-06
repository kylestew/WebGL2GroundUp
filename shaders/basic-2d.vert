#version 300 es

in vec4 position;
in vec4 color;

uniform mat4 u_transform;

out vec4 v_color;

void main() {
    // apply transform via matrix-vector mult
    gl_Position = u_transform * position;
    v_color = color;
}