#version 300 es

in vec4 position;
in vec3 normal;
in mat4 instanceWorld;

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
    vec4 worldPos = instanceWorld * position;
    gl_Position = uProjection * uView * worldPos;
    vFragPos = vec3(uView * worldPos);
    vNormal = transpose(inverse(mat3(uView * instanceWorld))) * normal;
    // transform world space light position to view space
    vLightPos = vec3(uView * vec4(uLight.position, 1.0));
}