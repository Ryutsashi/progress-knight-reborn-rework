let id = 0;
export default function getUniqueId() {
	return id++;
	// return Symbol.for(id++);
}