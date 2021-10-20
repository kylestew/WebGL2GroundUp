// #version 300 es

attribute vec4 position;
// in vec4 a_position;
// in vec4 a_color;

// uniform mat4 u_modelView;
// uniform mat4 u_projection;

// out vec4 v_color;

void main() {
    // gl_Position = u_projection * u_modelView * a_position;
    gl_Position = position;
    // v_color = a_color;
    // v_color = vec4(1, 1, 1, 1);
}