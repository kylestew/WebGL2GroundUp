#version 300 es

precision highp float;

in vec3 vFragPos;
in vec3 vNormal;
in vec3 vLightPos;

uniform vec3 uMaterialColor;
uniform float uAmbientIntensity;
uniform vec3 uAmbientColor;
uniform float uDiffuseIntensity;
uniform vec3 uDiffuseColor;
uniform float uSpecularIntensity;
uniform vec3 uSpecularColor;

out vec4 outColor;

void main() {
    // ambient
    vec3 ambient = uAmbientIntensity * uAmbientColor;

    // diffuse
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(vLightPos - vFragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uDiffuseIntensity * uDiffuseColor;

    // specular
    vec3 viewDir = normalize(-vFragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = spec * uSpecularIntensity * uSpecularColor;

    vec3 result = (ambient + diffuse + specular) * uMaterialColor;
    outColor = vec4(result, 1.0);
}