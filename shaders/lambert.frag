#version 300 es

precision highp float;

in vec3 v_pos;
in vec3 v_normal;
in mat3 v_normalMatrix;

uniform mat4 u_normalMatrix;
uniform vec3 u_materialColor;
uniform float u_ambientIntensity;
uniform vec3 u_ambientColor;
uniform float u_diffuseIntensity;
uniform vec3 u_diffuseColor;
uniform vec3 u_lightPosition;

out vec4 outColor;

void main() {
    // ambient
    vec3 ambient = u_ambientIntensity * u_ambientColor;

    // diffuse
    vec3 lightDir = normalize(u_lightPosition - v_pos);
    vec3 transformedNormal = normalize(v_normalMatrix * v_normal);
    float lambertian = max(dot(transformedNormal, lightDir), 0.0);
    vec3 diffuse = lambertian * u_diffuseIntensity * u_diffuseColor;

    vec3 result = (ambient + diffuse) * u_materialColor;
    outColor = vec4(result, 1.0);
}