import path from 'path';

export function getFileNameBody(filePath) {
    return path.parse(filePath).name;
}

export function getRelativePath(filePath) {
    const abs = path.resolve(filePath);
    const regex = /(.+)\.[^\.]+$/m;
    return "./" + path.relative(path.resolve('./src/'), abs).replace(regex,"$1");
}
