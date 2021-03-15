
class Camera
{
	constructor(viewSize, pos)
	{
		this.viewSize = viewSize;
		this.pos = pos;

		this.viewSizeHalf = this.viewSize.clone().half();
	}
}
