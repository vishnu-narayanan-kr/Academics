package webArtistREST;

public class Artist {
	private Integer art_id;
	private String art_name;
	private Integer num_art_paint;
	private Double tot_art_paint;
	
	private static Double Prv_Tax = 0.09;
	private static Double Fed_Tax = 0.07;
	
	public Double calculateTotalTax() {
		return Math.round(tot_art_paint * (Prv_Tax + Fed_Tax) * 100) / 100.0;
	}

	public Artist() {
		this.art_id = 0;
		this.art_name = "";
		this.num_art_paint = 0;
		this.tot_art_paint = 0.0;
	}
	
	public Artist(Integer art_id, String art_name, Integer num_art_paint, Double tot_art_paint) {
		this.art_id = art_id;
		this.art_name = art_name;
		this.num_art_paint = num_art_paint;
		this.tot_art_paint = tot_art_paint;
	}

	public Integer getArt_id() {
		return art_id;
	}

	public void setArt_id(Integer art_id) {
		this.art_id = art_id;
	}

	public String getArt_name() {
		return art_name;
	}

	public void setArt_name(String art_name) {
		this.art_name = art_name;
	}

	public Integer getNum_art_paint() {
		return num_art_paint;
	}

	public void setNum_art_paint(Integer num_art_paint) {
		this.num_art_paint = num_art_paint;
	}

	public Double getTot_art_paint() {
		return tot_art_paint;
	}

	public void setTot_art_paint(Double tot_art_paint) {
		this.tot_art_paint = tot_art_paint;
	}
}
