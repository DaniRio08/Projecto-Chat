package llenguatges;

public class Country {
	private String code;
	private String name;
	
	
	public Country() {
		
	}
	
	public Country(String code, String name) {
		this.setCode(code);
		this.setName(name);
	}
	
	public static String returnLista() {
		ConnectionDB db = new ConnectionDB();
		db.connectar();
		String json = db.getCountryList();
		db.close();
		return json;
	}

	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}