#version 300 es

/*
https://learnopengl.com/code_viewer_gh.php?code=src/2.lighting/2.4.basic_lighting_exercise2/basic_lighting_exercise2.cpp
*/

in vec4 position;
in vec3 normal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform Light uLight;

out vec3 vFragPos;
out vec3 vNormal;
out vec3 vLightPos;

void main() {
    gl_Position = uProjection * uView * uModel * position;
    vFragPos = vec3(uView * uModel * position);
    vNormal = transpose(inverse(mat3(uView * uModel))) * normal;
    // transform world space light position to view space
    vLightPos = vec3(uView * vec4(uLight.position, 1.0));
}