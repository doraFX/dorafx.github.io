function generateNormalMap(imgData) {
	const normalMap = new ImageData(imgData.width, imgData.height);
	// 遍历每个像素，计算并设置法线
	for (let y = 0; y < imgData.height; y++) {
		for (let x = 0; x < imgData.width; x++) {
			// 计算法线（此处算法非常简化）
			const normal = calculateNormal(x, y, imgData);
			const index = (y * imgData.width + x) * 4;
			normalMap.data[index] = normal.x; // R
			normalMap.data[index + 1] = normal.y; // G
			normalMap.data[index + 2] = normal.z; // B
			normalMap.data[index + 3] = 255; // Alpha
		}
	}
	return normalMap;
}

function calculateNormal(x, y, imgData) {
	// 假设左右相邻像素的颜色值代表高度差
	// 这里的实现非常基础，仅为示例
	const leftIndex = ((y * imgData.width) + Math.max(0, x - 1)) * 4;
	const rightIndex = ((y * imgData.width) + Math.min(imgData.width - 1, x + 1)) * 4;
	const upIndex = (Math.max(0, y - 1) * imgData.width + x) * 4;
	const downIndex = (Math.min(imgData.height - 1, y + 1) * imgData.width + x) * 4;

	const dx = (imgData.data[leftIndex] - imgData.data[rightIndex]) / 255.0;
	const dy = (imgData.data[upIndex] - imgData.data[downIndex]) / 255.0;

	// 通过高度差计算法线向量（非单位向量）
	const dz = 1;
	const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
	return {
		x: dx / length * 127 + 128,
		y: dy / length * 127 + 128,
		z: dz / length * 127 + 128
	};
}


function addRandomWearToCanvas(canvas) {
	var ctx = canvas.getContext('2d');
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;

	// 应用随机磨损效果
	for (var i = 0; i < data.length; i += 4) {
		var noise = 25 * (Math.random() - 0.5);
		data[i] += noise; // R
		data[i + 1] += noise; // G
		data[i + 2] += noise; // B
		// Alpha通道保持不变
	}

	// 将带有磨损效果的图像数据放回画布
	ctx.putImageData(imageData, 0, 0);
}